package livingin.steptheater.repository;

import livingin.steptheater.domain.Diary;
import livingin.steptheater.repository.diary.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class DiaryRepository {

    private final EntityManager em;

    /**
     * Diary Entity 등록
     */
    public void save(Diary diary) {
        em.persist(diary);
    }

    /**
     * id 기반으로 Diary 조회
     */
    public Diary findOne(Long id) {
        return em.find(Diary.class, id);
    }

    /**
     * 전체 다이어리 조회 로직
     */
    public List<DiaryQueryDto> findDiaryDtos() {
        return em.createQuery(
                "select new livingin.steptheater.repository.diary.DiaryQueryDto(d.id,m.nickname,d.diaryDate) " +
                        "from Diary d " +
                        "join d.member m ", DiaryQueryDto.class)
                .getResultList();
    }

    /**
     * 특정 회원 다이어리 조회 로직
     */
    public List<DiaryQueryDto> findOneDiaryDto(Long userId, String date) {
        return em.createQuery(
                "select new livingin.steptheater.repository.diary.DiaryQueryDto(d.id,m.nickname,d.diaryDate) " +
                        "from Diary d " +
                        "join d.member m " +
                        "where m.id = :id " +
                        "and d.diaryDate = :date", DiaryQueryDto.class)
                .setParameter("id", userId)
                .setParameter("date", LocalDate.parse(date))
                .getResultList();

    }

    /**
     * 특정 회원의 특정 날짜 다이어리 조회
     */
    public Diary findOneDiary(Long userId, String date) {
        List<Diary> resultList = em.createQuery(
                "select d " +
                        "from Diary d " +
                        "join d.member m " +
                        "where m.id = :id " +
                        "and d.diaryDate = :date", Diary.class)
                .setParameter("id", userId)
                .setParameter("date", LocalDate.parse(date))
                .setMaxResults(1)
                .getResultList();

        if (resultList.isEmpty()) return null;
        return resultList.get(0);
    }

    /**
     * 특정 회원의 특정 기간 사이 다이어리 조회 로직
     */
    public List<DiaryInfoDto> findDiaryByDate(Long id, String startDate, String endDate) {
        List<DiaryInfoDto> result = em.createQuery("select new livingin.steptheater.repository.diary.DiaryInfoDto(d.id, d.diaryDate) " +
                "from Diary d " +
                "join d.member m " +
                "where m.id = :id " +
                "and d.diaryDate >= :sDate " +
                "and d.diaryDate <= :eDate ", DiaryInfoDto.class)
                .setParameter("id", id)
                .setParameter("sDate", LocalDate.parse(startDate))
                .setParameter("eDate", LocalDate.parse(endDate))
                .getResultList();

        result.forEach(o -> {
            List<RouteInfoDto> resultList = em.createQuery("select new livingin.steptheater.repository.diary.RouteInfoDto(r.id, r.name) " +
                    "from Route r " +
                    "join r.diary d " +
                    "where d.id = :id ", RouteInfoDto.class)
                    .setParameter("id", o.getId())
                    .getResultList();
            resultList.sort(new Comparator<RouteInfoDto>() {
                @Override
                public int compare(RouteInfoDto o1, RouteInfoDto o2) {
                    return Long.compare(o2.getId(), o1.getId());
                }
            });
            resultList.forEach(o1 -> {
                List<DiaryItemInfoDto> diaryItems = em.createQuery("select new livingin.steptheater.repository.diary.DiaryItemInfoDto(di.id, di.title, di.description, di.latitude, di.longitude, di.imageUrl, di.thumbUrl) " +
                        "from DiaryItem di " +
                        "join di.route r " +
                        "where r.id = :id ", DiaryItemInfoDto.class)
                        .setParameter("id", o1.getId())
                        .getResultList();
                o1.setDiaryItems(diaryItems);

                List<RouteItemInfoDto> routeItems = em.createQuery("select new livingin.steptheater.repository.diary.RouteItemInfoDto(ri.latitude, ri.longitude) " +
                        "from RouteItem ri " +
                        "join ri.route r " +
                        "where r.id = :id ", RouteItemInfoDto.class)
                        .setParameter("id", o1.getId())
                        .getResultList();
                o1.setRouteItems(routeItems);
            });
            o.setRoutes(resultList);
        });
        return result;
    }

    /**
     * 특정 회원의 최근 다이어리 조회 로직
     */
    public List<DiaryInfoDto> findRecentDiary(Long id, Integer count) {
        int routeCnt = 0;
        List<DiaryInfoDto> result = em.createQuery("select new livingin.steptheater.repository.diary.DiaryInfoDto(d.id, d.diaryDate) " +
                "from Diary d " +
                "join d.member m " +
                "where m.id = :id " +
                "order by d.diaryDate desc", DiaryInfoDto.class)
                .setParameter("id", id)
                .getResultList();

        for (int i = 0; i < result.size(); i++) {
            DiaryInfoDto o = result.get(i);
            if(routeCnt>=count) {
                result.remove(i);
                continue;
            }
            List<RouteInfoDto> resultList = em.createQuery("select new livingin.steptheater.repository.diary.RouteInfoDto(r.id, r.name) " +
                    "from Route r " +
                    "join r.diary d " +
                    "where d.id = :id ", RouteInfoDto.class)
                    .setParameter("id", o.getId())
                    .getResultList();
            resultList.sort(new Comparator<RouteInfoDto>() {
                @Override
                public int compare(RouteInfoDto o1, RouteInfoDto o2) {
                    return Long.compare(o2.getId(), o1.getId());
                }
            });

            for (int j = 0; j < resultList.size(); j++) {
                RouteInfoDto o1 = resultList.get(j);
                if(routeCnt>=count) {
                    resultList.remove(j);
                    continue;
                }
                List<RouteItemInfoDto> routeItems = em.createQuery("select new livingin.steptheater.repository.diary.RouteItemInfoDto(ri.latitude, ri.longitude) " +
                        "from RouteItem ri " +
                        "join ri.route r " +
                        "where r.id = :id ", RouteItemInfoDto.class)
                        .setParameter("id", o1.getId())
                        .getResultList();
                if (routeItems.isEmpty()) {
                    resultList.remove(j);
                    continue;
                }
                routeCnt += 1;
                System.out.println("routeCnt = " + routeCnt);
                o1.setRouteItems(routeItems);
                System.out.println("o1 = " + o1);

                List<DiaryItemInfoDto> diaryItems = em.createQuery("select new livingin.steptheater.repository.diary.DiaryItemInfoDto(di.id, di.title, di.description, di.latitude, di.longitude, di.imageUrl, di.thumbUrl) " +
                        "from DiaryItem di " +
                        "join di.route r " +
                        "where r.id = :id ", DiaryItemInfoDto.class)
                        .setParameter("id", o1.getId())
                        .getResultList();
                o1.setDiaryItems(diaryItems);
            }

            o.setRoutes(resultList);

        }
        List<DiaryInfoDto> collect = result.stream().filter(o -> {
            if (o.getRoutes() == null) return false;
            if (o.getRoutes().isEmpty()) return false;
            return true;
        }).collect(Collectors.toList());
        for (int i = 0; i < collect.size(); i++) {
            DiaryInfoDto o = collect.get(i);
            o.setRoutes(o.getRoutes().stream().filter(routeInfoDto -> {
                if(routeInfoDto.getRouteItems() == null)return false;
                return true;
            }).collect(Collectors.toList()));
        }
        return collect;
    }
}
