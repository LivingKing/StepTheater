package livingin.steptheater.controller;

import livingin.steptheater.domain.Route;
import livingin.steptheater.repository.diary.RouteExistDiaryQueryDto;
import livingin.steptheater.service.RouteService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @PostMapping("/api/route")
    public CreateRouteResponse saveRoute(
            @RequestBody @Valid CreateRouteRequest request
    ){
        System.out.println("request = " + request);
        Long routeId = routeService.join(request.id, request.date, request.name);

        return new CreateRouteResponse(1);
    }

    @GetMapping("/api/route/duplicate")
    public FindRouteResponse findRoute(
            @RequestParam(value = "id") Long id,
            @RequestParam(value = "date") String date,
            @RequestParam(value = "name") String name
    ){
        return new FindRouteResponse(routeService.duplicateCheck(id, date, name));
    }

    @GetMapping("/api/route/exist")
    public Result findExistRoute(
            @RequestParam(value = "id") Long id,
            @RequestParam(value = "date") String date)
    {
        List<RouteExistDiaryQueryDto> routeByDate = routeService.findExistRouteByDate(id, date);
        return new Result(routeByDate.size(),routeByDate);
    }

    @Data
    @AllArgsConstructor
    static class CreateRouteResponse {
        private int id;
    }

    @Data
    static class CreateRouteRequest<T> {
        private Long id;
        private String date;
        private String name;
    }

    @Data
    @AllArgsConstructor
    static class FindRouteResponse {
        private Boolean result;
    }

    @Data
    @AllArgsConstructor
    static class Result<T>{
        private int count;
        private T data;
    }
}
