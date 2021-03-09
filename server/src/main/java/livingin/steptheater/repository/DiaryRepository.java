package livingin.steptheater.repository;

import livingin.steptheater.domain.Diary;
import livingin.steptheater.repository.diary.DiaryInfoDto;
import livingin.steptheater.repository.diary.DiaryQueryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class DiaryRepository {

    private final EntityManager em;

    public void save(Diary diary){
        em.persist(diary);
    }
    public Diary findOne(Long id){
        return em.find(Diary.class, id);
    }
    public List<DiaryQueryDto> findDiaryDtos(){
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
                .setParameter("date", date)
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
                .setParameter("date", date)
                .setMaxResults(1)
                .getResultList();

        if(resultList.isEmpty()) return null;
        return resultList.get(0);
    }

    public List<DiaryInfoDto> findDiaryByDate(Long id, String date){
//        return  em.createQuery("select new livingin.steptheater.repository.diary.DiaryInfoDto(d.diaryDate, new livingin.steptheater.repository.diary.RouteInfoDto(r.name, new livingin.steptheater.repository.diary.RouteItemInfoDto(ri.latitude, ri.longitude)), new livingin.steptheater.repository.diary.DiaryItemInfoDto(di.title, di.description, di.latitude, di.longitude, di.thumbUrl, di.imageUrl)) " +

        return em.createQuery("select new livingin.steptheater.repository.diary.DiaryInfoDto(d.diaryDate, r.name, ri.latitude, ri.longitude,  di.title, di.description, di.latitude, di.longitude, di.imageUrl, di.thumbUrl) " +
                "from Route r " +
                "join r.diary d " +
                "join d.member m " +
                "join RouteItem ri " +
                "join DiaryItem  di " +
                "where m.id = :id " +
                "and d.diaryDate = :date", DiaryInfoDto.class)
                .setParameter("id",id)
                .setParameter("date", date+"%")
                .getResultList();
    }
}
