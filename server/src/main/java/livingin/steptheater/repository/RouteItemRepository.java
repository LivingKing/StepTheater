package livingin.steptheater.repository;

import livingin.steptheater.domain.RouteItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
@RequiredArgsConstructor
public class RouteItemRepository {
    private final EntityManager em;

    /**
     * routeItem Entity 저장
     */
    public void save(RouteItem routeItem) {
        em.persist(routeItem);
    }

    /**
     * id 기반 RouteItem 조회
     */
    public RouteItem findOne(Long id) {
        return em.find(RouteItem.class, id);
    }
}
