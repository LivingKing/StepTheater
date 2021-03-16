package livingin.steptheater.controller;

import livingin.steptheater.repository.diary.RouteExistDiaryQueryDto;
import livingin.steptheater.service.RouteService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
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

    @GetMapping("/api/route")
    public GetRouteResponse findRoute(
            @RequestParam(value="id") Long id,
            @RequestParam(value="date") String date
    ){
        return new GetRouteResponse(routeService.findRouteByDate(id, date, date).size());
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
            @RequestParam(value = "date") String date,
            @RequestParam(value = "type") String type)
    {
        String startDate = "";
        String endDate = "";
        String[] sDate = date.split("-");
        LocalDate localDate = LocalDate.of(Integer.parseInt(sDate[0]),
                Integer.parseInt(sDate[1]),
                Integer.parseInt(sDate[2]));
        System.out.println("localDate = " + localDate);
        if (type.equals("day")) {
            startDate = endDate = date;
        } else if (type.equals("week")) {
            LocalDate temp = localDate.minusDays(localDate.getDayOfWeek().getValue()-1);
            startDate = temp.toString();
            endDate = temp.plusDays(6).toString();
        } else if (type.equals("month")) {
            LocalDate temp = localDate.minusDays(localDate.getDayOfMonth()-1);
            startDate = temp.toString();
            endDate = temp.plusMonths(1).minusDays(1).toString();
        }
        List<RouteExistDiaryQueryDto> routeByDate = routeService.findRouteByDate(id, startDate, endDate);
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

    @Data
    @AllArgsConstructor
    static class GetRouteResponse {
        private int count;
    }
}
