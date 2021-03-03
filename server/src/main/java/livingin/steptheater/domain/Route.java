package livingin.steptheater.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Route {
    @Id
    @GeneratedValue
    @Column(name = "route_id")
    private Long id;


    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name="route_id")
    private List<RouteItem> routeItems = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "diary_id")
    private Diary diary;

    private String name;

    private String imageUrl;

    //==연관관계 메서드==//
    public void addRouteItem(RouteItem routeItem) {
        routeItems.add(routeItem);
    }
}
