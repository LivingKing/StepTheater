package livingin.steptheater.repository;

import livingin.steptheater.domain.Diary;
import livingin.steptheater.repository.diary.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class DiaryRepository {

    private final EntityManager em;

    public void save(Diary diary) {
        em.persist(diary);
    }

    public Diary findOne(Long id) {
        return em.find(Diary.class, id);
    }

    public List<DiaryQueryDto> findDiaryDtos() {
        return em.createQuery(
                "select new livingin.steptheater.repository.diary.DiaryQueryDto(d.id,m.nickname,d.diaryDate) " +
                        "from Diary d " +
                        "join d.member m", DiaryQueryDto.class)
                .getResultList();
    }

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

    public List<DiaryInfoDto> findDiaryByDate(Long id, String startDate, String endDate) {
        List<DiaryInfoDto> result = em.createQuery("select new livingin.steptheater.repository.diary.DiaryInfoDto(d.id, d.diaryDate) " +
                "from Diary d " +
                "join d.member m " +
                "where m.id = :id " +
                "and d.diaryDate >= :sDate " +
                "and d.diaryDate <= :eDate", DiaryInfoDto.class)
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

            resultList.forEach(o1 -> {
                List<DiaryItemInfoDto> diaryItems = em.createQuery("select new livingin.steptheater.repository.diary.DiaryItemInfoDto(di.id, di.title, di.description, di.latitude, di.longitude, di.imageUrl, di.thumbUrl) " +
                        "from DiaryItem di " +
                        "join di.route r " +
                        "where r.id = :id ", DiaryItemInfoDto.class)
                        .setParameter("id", o1.getId())
                        .getResultList();
                o1.setDiaryItems(diaryItems);

                List<RouteItemInfoDto> routeItems = em.createQuery("select new livingin.steptheater.repository.diary.RouteItemInfoDto(ri.longitude, ri.longitude) " +
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
}
