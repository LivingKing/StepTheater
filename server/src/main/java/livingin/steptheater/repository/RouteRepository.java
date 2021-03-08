package livingin.steptheater.repository;

import livingin.steptheater.domain.Route;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
@RequiredArgsConstructor
public class RouteRepository {
    private final EntityManager em;

    public void save(Route route){
        em.persist(route);
    }

    public Route findOne(Long id){
        return em.find(Route.class, id);
    }
}
