package livingin.steptheater.repository;

import livingin.steptheater.domain.Diary;
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
                .setParameter("id",userId)
                .setParameter("date", date)
                .getResultList();
    }
}
