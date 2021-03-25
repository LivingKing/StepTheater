package livingin.steptheater.service;

import livingin.steptheater.domain.Diary;
import livingin.steptheater.domain.DiaryItem;
import livingin.steptheater.domain.Route;
import livingin.steptheater.repository.DiaryItemRepository;
import livingin.steptheater.repository.RouteRepository;
import livingin.steptheater.repository.diary.DiaryQueryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DiaryItemService {
    private final DiaryItemRepository diaryItemRepository;
    private final RouteService routeService;
    private final DiaryService diaryService;

    @Transactional
    public Long join(Long id,
                     String date,
                     String title,
                     String desc,
                     String thumb_url,
                     String image_url,
                     Double latitude,
                     Double longitude,
                   String name) {
        DiaryItem diaryItem = new DiaryItem();
        DiaryQueryDto diaryQueryDto = diaryService.findOneDiaryDto(id, date).get(0);
        Diary diary = diaryService.findOne(diaryQueryDto.getDiaryId());
        diaryItem.setDiary(diary);
        diaryItem.setRoute(routeService.findOneByName(diary.getId(), name));
        diaryItem.setTitle(title);
        diaryItem.setDescription(desc);
        diaryItem.setThumbUrl(thumb_url);
        diaryItem.setImageUrl(image_url);
        diaryItem.setLatitude(latitude);
        diaryItem.setLongitude(longitude);
        diaryItemRepository.save(diaryItem);
        return diaryItem.getId();
    }
}
