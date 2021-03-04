package livingin.steptheater.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import static javax.persistence.FetchType.LAZY;

@Entity
@Getter
@Setter
public class RouteItem {
    @Id @GeneratedValue
    private Long id;
    private double latitude;
    private double longitude;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "route_id")
    private Route route;
}
