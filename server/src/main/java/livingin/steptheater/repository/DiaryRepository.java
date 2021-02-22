package livingin.steptheater.repository;

import livingin.steptheater.domain.Diary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

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

}
