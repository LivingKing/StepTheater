package livingin.steptheater.service;

import livingin.steptheater.domain.Diary;
import livingin.steptheater.domain.Route;
import livingin.steptheater.domain.RouteItem;
import livingin.steptheater.repository.RouteItemRepository;
import livingin.steptheater.repository.diary.DiaryQueryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RouteItemService {
    private final RouteItemRepository routeItemRepository;
    private final RouteService routeService;
    private final DiaryService diaryService;

    @Transactional
    public RouteItem save(double latitude, double longitude, Long id, String date, String name){
        RouteItem routeItem = new RouteItem();
        routeItem.setLatitude(latitude);
        routeItem.setLongitude(longitude);
        List<DiaryQueryDto> oneDiaryDto = diaryService.findOneDiaryDto(id, date);
        Diary diary = diaryService.findOne(oneDiaryDto.get(0).getDiaryId());
        routeItem.setRoute(routeService.findOneByName(diary.getId(), name));
        routeItemRepository.save(routeItem);
        return routeItem;
    }
}
