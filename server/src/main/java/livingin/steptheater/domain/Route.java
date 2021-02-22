package livingin.steptheater.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.List;

import static javax.persistence.FetchType.LAZY;

@Entity
@Getter @Setter
public class Route {
    @Id
    @GeneratedValue
    @Column(name = "route_id")
    private Long id;

    @OneToOne(mappedBy = "route", fetch = LAZY)
    private Diary diary;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<RouteItem> routeItems = new ArrayList<>();


    //==연관관계 메서드==//
    public void addRouteItem(RouteItem routeItem){
        routeItems.add(routeItem);
        routeItem.setRoute(this);
    }
}
