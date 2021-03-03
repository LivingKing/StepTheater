package livingin.steptheater.service;

import livingin.steptheater.domain.Diary;
import livingin.steptheater.domain.Member;
import livingin.steptheater.domain.Route;
import livingin.steptheater.domain.RouteItem;
import livingin.steptheater.repository.DiaryRepository;
import livingin.steptheater.repository.MemberRepository;
import livingin.steptheater.repository.RouteRepository;
import livingin.steptheater.repository.diary.DiaryQueryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository routeRepository;
    private final MemberRepository memberRepository;
    private final DiaryRepository diaryRepository;

    @Transactional
    public Long join(Long id, String date, List<RouteItem> routeItems, String url){
        Route route = new Route();

        Diary diary = diaryRepository.findOne(diaryRepository.findOneDiaryDto(id, date).get(0).getDiaryId());
        route.setDiary(diary);
        for (RouteItem routeItem : routeItems) {
            route.addRouteItem(routeItem);
        }
        route.setImageUrl(url);
        routeRepository.save(route);

        return route.getId();
    }
}
