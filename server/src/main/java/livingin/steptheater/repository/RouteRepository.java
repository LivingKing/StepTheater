package livingin.steptheater.repository;

import livingin.steptheater.domain.Route;
import livingin.steptheater.repository.diary.RouteExistDiaryQueryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.util.*;

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

    public Route findOneByDiaryId(Long id){
        List<Route> routeList = em.createQuery("select r from Route r " +
                "where r.diary = : id")
                .setParameter("id", id)
                .setMaxResults(1)
                .getResultList();
        if(routeList.isEmpty()) return null;
        else return routeList.get(0);
    }

    public Route findOneByName(Long id, String name){
        List<Route> resultList = em.createQuery("select r from Route r " +
                "join r.diary d " +
                "where r.name = :name " +
                "and d.id = :id", Route.class)
                .setParameter("name", name)
                .setParameter("id", id)
                .getResultList();
        if(resultList.isEmpty()) return null;
        return resultList.get(0);
    }

    public List<Route> findByDiaryId(Long id){
        List<Route> resultList = em.createQuery("select r from Route r " +
                "join r.diary d " +
                "where d.id = :id")
                .setParameter("id", id)
                .getResultList();
        if(resultList.isEmpty()) return null;
        return resultList;
    }
    public List<RouteExistDiaryQueryDto> findExistRouteByDate(Long userId, String startDate, String endDate){
        return em.createQuery("select new livingin.steptheater.repository.diary.RouteExistDiaryQueryDto(d.diaryDate) " +
                "from Route r " +
                "join r.diary d " +
                "join d.member m " +
                "where m.id = :userId " +
                "and d.diaryDate >= :sDate " +
                "and d.diaryDate <= :eDate", RouteExistDiaryQueryDto.class)
                .setParameter("userId",userId)
                .setParameter("sDate", LocalDate.parse(startDate))
                .setParameter("eDate", LocalDate.parse(endDate))
                .getResultList();
    }
}
