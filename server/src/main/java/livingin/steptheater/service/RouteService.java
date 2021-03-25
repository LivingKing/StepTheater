package livingin.steptheater.service;

import livingin.steptheater.domain.Diary;
import livingin.steptheater.domain.Route;
import livingin.steptheater.repository.RouteRepository;
import livingin.steptheater.repository.diary.RouteExistDiaryQueryDto;
import livingin.steptheater.repository.diary.RouteQueryDto;
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

    public Route findOneByName(Long id, String name) {return  routeRepository.findOneByName(id, name);}

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

    public List<RouteQueryDto> findRouteByOneDate(Long id, String date){
        return routeRepository.findOneRouteByDate(id, date);

    }public List<RouteQueryDto> findRouteByDate(Long id, String startDate, String endDate){
        return routeRepository.findRouteByDate(id, startDate, endDate);
    }
    public List<RouteExistDiaryQueryDto> findExistRouteByDate(Long id, String startDate, String endDate) {
        return routeRepository.findExistRouteByDate(id, startDate, endDate);
    }
    @Transactional
    public void updateName(Long id, String date, String name, String newName){
        Diary diary = diaryService.findOne(diaryService.findOneDiaryDto(id, date).get(0).getDiaryId());
        Route route = routeRepository.findOneByName(diary.getId(), name);
        route.setName(newName);
    }

    @Transactional
    public void updateRouteTimeAndDis(Long id, String date, String name, Double distance, Integer hours, Integer minutes, Integer markers) {
        Diary diary = diaryService.findOne(diaryService.findOneDiaryDto(id, date).get(0).getDiaryId());
        Route route = routeRepository.findOneByName(diary.getId(), name);
        route.setDistance(distance);
        route.setHours(hours);
        route.setMinutes(minutes);
        route.setMarkers(markers);
    }


}
