package livingin.steptheater.controller;

import livingin.steptheater.domain.Route;
import livingin.steptheater.domain.RouteItem;
import livingin.steptheater.repository.RouteRepository;
import livingin.steptheater.service.RouteItemService;
import livingin.steptheater.service.RouteService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;
    private final RouteItemService routeItemService;
    @PostMapping("/api/route")
    public CreateRouteResponse saveRoute(
            @RequestBody @Valid CreateRouteRequest request
    ){
        System.out.println("request = " + request);
        Long routeId = routeService.join(request.id, request.date);
        Route route = routeService.findOne(routeId);
        List<RouteItem> routeItems = new ArrayList<>();
        for (double[] location : request.data) {
            routeItems.add(routeItemService.save(location[0], location[1], route));
        }

        return new CreateRouteResponse(1);
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
        private double[][] data;
    }
}
