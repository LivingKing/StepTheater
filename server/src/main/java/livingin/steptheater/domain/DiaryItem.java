package livingin.steptheater.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import static javax.persistence.FetchType.LAZY;

@Entity
@Getter @Setter
public class DiaryItem {
    @Id @GeneratedValue
    @Column(name="diary_item_id")
    private Long id;

    private String title;

    private String description;

    private String imageUrl;

    private String thumbUrl;

    private Double latitude;

    private Double longitude;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name ="route_id")
    private Route route;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;
}
