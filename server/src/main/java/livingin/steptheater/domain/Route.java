package livingin.steptheater.domain;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

import static javax.persistence.FetchType.LAZY;

@Entity
@Getter
@Setter
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"name", "diary_id"}
                )
        }
)
public class Route {
    @Id
    @GeneratedValue
    @Column(name = "route_id")
    private Long id;


    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<RouteItem> routeItems = new ArrayList<>();

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<DiaryItem> diaryItems = new ArrayList<>();

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;

    private String name;

    private double distance;

    private int hours;

    private int minutes;

    private int markers;

    //==연관관계 메서드==//
    public void addRouteItem(RouteItem routeItem) {
        routeItems.add(routeItem);
    }

    public void addDiaryItem(DiaryItem diaryItem) {
        diaryItems.add(diaryItem);
    }
}
