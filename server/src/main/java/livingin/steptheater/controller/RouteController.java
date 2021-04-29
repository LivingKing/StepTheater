package livingin.steptheater.controller;

import livingin.steptheater.repository.diary.RouteExistDiaryQueryDto;
import livingin.steptheater.repository.diary.RouteQueryDto;
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

    /**
     * 동선 저장 API
     */
    @PostMapping("/api/route")
    public CreateRouteResponse saveRoute(
            @RequestBody @Valid CreateRouteRequest request
    ) {
        System.out.println("request = " + request);
        Long routeId = routeService.join(request.id, request.date, request.name);

        return new CreateRouteResponse(1);
    }

    /**
     * 동선 업데이트 API
     */
    @PutMapping("/api/route")
    public PutRouteResponse updateRoute(
            @RequestBody RouteVo routeVo
    ) {
        System.out.println("routeVo = " + routeVo);
        if (routeVo.newName != null) {
            routeService.updateName(routeVo.id, routeVo.date, routeVo.name, routeVo.newName);
        }
        if (routeVo.distance != null && routeVo.distance != null && routeVo.minutes != null && routeVo.markers != null) {
            routeService.updateRouteTimeAndDis(
                    routeVo.id,
                    routeVo.date,
                    routeVo.name,
                    routeVo.distance,
                    routeVo.hours,
                    routeVo.minutes,
                    routeVo.markers);
        }
        return new PutRouteResponse(1);
    }

    /**
     * 특정 회원 특정 날짜 동선 조회 API
     */
    @GetMapping("/api/route")
    public GetRouteResponse findRoute(
            @RequestParam(value = "id") Long id,
            @RequestParam(value = "date") String date
    ) {
        List<RouteQueryDto> routeByDate = routeService.findRouteByOneDate(id, date);
        Double totalDistance = 0.0;
        Integer totalHours = 0;
        Integer totalMinutes = 0;
        Integer totalMarkers = 0;
        for (RouteQueryDto routeQueryDto : routeByDate) {
            totalDistance += routeQueryDto.getDistance();
            totalHours += routeQueryDto.getHours();
            totalMinutes += routeQueryDto.getMinutes();
            totalMarkers += routeQueryDto.getMarkers();
        }
        return new GetRouteResponse(routeByDate.size(), totalDistance, totalHours, totalMinutes, totalMarkers, routeByDate);
    }


    /**
     * 특정 회원 일, 주, 월 동선 조회 API
     */
    @GetMapping("/api/routes")
    public GetRouteResponse findRoutes(
            @RequestParam(value = "id") Long id,
            @RequestParam(value = "date") String date,
            @RequestParam(value = "type") String type
    ) {
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
            LocalDate temp;
            if(localDate.getDayOfWeek().getValue() == 7)
                temp = localDate;
            else
                temp = localDate.minusDays(localDate.getDayOfWeek().getValue());
            startDate = temp.toString();
            endDate = temp.plusDays(6).toString();
            System.out.println("startDate = " + startDate);
            System.out.println("endDate = " + endDate);
        } else if (type.equals("month")) {
            LocalDate temp = localDate.minusDays(localDate.getDayOfMonth()-1);
            startDate = temp.toString();
            endDate = temp.plusMonths(1).minusDays(1).toString();
        }
        List<RouteQueryDto> routeByDate = routeService.findRouteByDate(id, startDate, endDate);
        Double totalDistance = 0.0;
        Integer totalHours = 0;
        Integer totalMinutes = 0;
        Integer totalMarkers = 0;
        for (RouteQueryDto routeQueryDto : routeByDate) {
            totalDistance += routeQueryDto.getDistance();
            totalHours += routeQueryDto.getHours();
            totalMinutes += routeQueryDto.getMinutes();
            totalMarkers += routeQueryDto.getMarkers();
        }
        return new GetRouteResponse(routeByDate.size(), totalDistance, totalHours, totalMinutes, totalMarkers, routeByDate);
    }

    /**
     * 동선 이름 중복 조회 API
     */
    @GetMapping("/api/route/duplicate")
    public FindRouteResponse findRoute(
            @RequestParam(value = "id") Long id,
            @RequestParam(value = "date") String date,
            @RequestParam(value = "name") String name
    ) {
        return new FindRouteResponse(routeService.duplicateCheck(id, date, name));
    }

    /**
     * 특정 회원의 특정 기간동안 동선이 존재하는 날 조회
     */
    @GetMapping("/api/route/exist")
    public Result findExistRoute(
            @RequestParam(value = "id") Long id,
            @RequestParam(value = "date") String date,
            @RequestParam(value = "type") String type) {
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
            LocalDate temp = localDate.minusDays(localDate.getDayOfWeek().getValue() - 1);
            startDate = temp.toString();
            endDate = temp.plusDays(6).toString();
        } else if (type.equals("month")) {
            LocalDate temp = localDate.minusDays(localDate.getDayOfMonth() - 1);
            startDate = temp.toString();
            endDate = temp.plusMonths(1).minusDays(1).toString();
        }
        List<RouteExistDiaryQueryDto> routeByDate = routeService.findExistRouteByDate(id, startDate, endDate);
        return new Result(routeByDate.size(), routeByDate);
    }

    /**
     * 데이터 처리를 위한 Data class들
     */
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
    static class Result<T> {
        private int count;
        private T data;
    }

    @Data
    @AllArgsConstructor
    static class GetRouteResponse<T> {
        private int count;
        private double totalDistance;
        private int totalHours;
        private int totalMinutes;
        private int totalMarkers;
        private T data;
    }

    @Data
    @AllArgsConstructor
    static class PutRouteResponse {
        private int count;
    }

    @Data
    static class RouteVo {
        private Long id;
        private String date;
        private String name;
        private String newName;
        private Double distance;
        private Integer hours;
        private Integer minutes;
        private Integer markers;
    }
}
