package livingin.steptheater.controller;

import livingin.steptheater.domain.RouteItem;
import livingin.steptheater.service.RouteItemService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class RouteItemController {
    private final RouteItemService routeItemService;

    /**
     * 좌표 저장 API
     */
    @PostMapping("/api/route/item")
    public CreateRouteItemResponse saveRouteItem(
            @RequestBody @Valid CreateRouteItemRequest request
    ){
        System.out.println("request = " + request);
        for (double[] location : request.data){
            routeItemService.save(location[0],location[1], request.id, request.date, request.route_name);
        }
        return new CreateRouteItemResponse(1);
    }

    /**
     * Data 처리를 위한 API
     */
    
    @Data
    @AllArgsConstructor
    static class CreateRouteItemResponse {
        private Integer count;
    }

    @Data
    static class CreateRouteItemRequest {
        private Long id;
        private String date;
        private double[][] data;
        private String route_name;
    }
}
