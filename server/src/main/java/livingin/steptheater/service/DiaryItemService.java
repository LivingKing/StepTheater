package livingin.steptheater.service;

import livingin.steptheater.domain.DiaryItem;
import livingin.steptheater.repository.DiaryItemRepository;
import livingin.steptheater.repository.diary.DiaryQueryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DiaryItemService {
    private final DiaryItemRepository diaryItemRepository;
    private final DiaryService diaryService;

    @Transactional
    public Long join(Long id, String date, String title, String desc, String thumb_url, String image_url) {
        DiaryItem diaryItem = new DiaryItem();
        DiaryQueryDto diaryQueryDto = diaryService.findOneDiaryDto(id, date).get(0);
        diaryItem.setDiary(diaryService.findOne(diaryQueryDto.getDiaryId()));
        diaryItem.setTitle(title);
        diaryItem.setDescription(desc);
        diaryItem.setThumbUrl(thumb_url);
        diaryItem.setImageUrl(image_url);
        diaryItemRepository.save(diaryItem);
        return diaryItem.getId();
    }
}
