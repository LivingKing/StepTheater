package livingin.steptheater.service;

import livingin.steptheater.domain.Diary;
import livingin.steptheater.domain.Member;
import livingin.steptheater.domain.Route;
import livingin.steptheater.domain.RouteItem;
import livingin.steptheater.repository.DiaryRepository;
import livingin.steptheater.repository.MemberRepository;
import livingin.steptheater.repository.RouteRepository;
import livingin.steptheater.repository.diary.DiaryQueryDto;
import livingin.steptheater.repository.diary.RouteExistDiaryQueryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository routeRepository;
    private final DiaryService diaryService;

    @Transactional
    public Long join(Long id, String date, String name) {
        Route route = new Route();

        Diary diary = diaryService.findOne(diaryService.findOneDiaryDto(id, date).get(0).getDiaryId());
        route.setDiary(diary);
        route.setName(name);
        routeRepository.save(route);

        return route.getId();
    }

    public Route findOne(Long id) {
        return routeRepository.findOne(id);
    }

    public Route findOneByDiaryId(Long id) {
        return routeRepository.findOneByDiaryId(id);
    }

    public List<Route> findByDiary(Diary d) {
        return routeRepository.findByDiaryId(d.getId());
    }

    public Boolean duplicateCheck(Long id, String date, String name) {
        Diary diary = diaryService.findOneDiary(id, date);
        System.out.println(diary);
        Boolean result = true;
        try {
            List<Route> routeList = routeRepository.findByDiaryId(diary.getId());
            if (routeList != null) {
                for (Route route : routeList) {
                    if (route.getName().equals(name)) {
                        result = false;
                        break;
                    }
                }
            }
        } catch (Exception e) {
            result = false;
            System.out.println(e);
        } finally {
            return result;
        }
    }

    public List<RouteExistDiaryQueryDto> findExistRouteByDate (Long id, String date){
        return routeRepository.findExistRouteByDate(id, date);
    }
}
