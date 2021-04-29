package livingin.steptheater.repository;

import livingin.steptheater.domain.Diary;
import livingin.steptheater.domain.DiaryItem;
import livingin.steptheater.repository.diary.DiaryQueryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class DiaryItemRepository {

    private final EntityManager em;

    /**
     * DiaryItem Entity 등록
     */
    public void save(DiaryItem diaryItem){
        em.persist(diaryItem);
    }

    /**
     * id 기반으로 DiaryItem 조회
     */
    public DiaryItem findOne(Long id){
        return em.find(DiaryItem.class, id);
    }
}
