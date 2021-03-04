package livingin.steptheater.service;

import livingin.steptheater.domain.Route;
import livingin.steptheater.domain.RouteItem;
import livingin.steptheater.repository.RouteItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RouteItemService {
    private final RouteItemRepository routeItemRepository;

    @Transactional
    public RouteItem save(double latitude, double longitude, Route route){
        RouteItem routeItem = new RouteItem();
        routeItem.setLatitude(latitude);
        routeItem.setLongitude(longitude);
        routeItem.setRoute(route);
        routeItemRepository.save(routeItem);
        return routeItem;
    }
}
