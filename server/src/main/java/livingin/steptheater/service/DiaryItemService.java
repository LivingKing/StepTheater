package livingin.steptheater.service;

import livingin.steptheater.domain.DiaryItem;
import livingin.steptheater.repository.DiaryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DiaryItemService {
    private final DiaryItemRepository diaryItemRepository;

    @Transactional
    public Long join(DiaryItem diaryItem){
        diaryItemRepository.save(diaryItem);
        return diaryItem.getId();
    }
}
