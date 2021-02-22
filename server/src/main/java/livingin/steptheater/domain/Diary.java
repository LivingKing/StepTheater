package livingin.steptheater.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static javax.persistence.FetchType.LAZY;

@Entity
@Table(name = "diaries")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Diary {

    @Id
    @GeneratedValue
    @Column(name = "diary_id")
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;


    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL)
    private List<DiaryItem> diaryItems = new ArrayList<>();

    @OneToOne(fetch = LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "route_id")
    private Route route;

    private LocalDateTime diaryDate;

    //==연관관계 메서드==//
    public void setMember(Member member){
        this.member = member;
        member.getDiaries().add(this);
    }

    public void addDiaryItem(DiaryItem diaryItem){
        diaryItems.add(diaryItem);
    }

    public void setRoute(Route route){
        this.route = route;
        route.setDiary(this);
    }

    //==생성 메서드==//
    public static Diary createDiary(Member member, Route route, DiaryItem... diaryItems){
        Diary diary = new Diary();
        diary.setMember(member);
        diary.setRoute(route);
        for (DiaryItem diaryItem : diaryItems) {
            diary.addDiaryItem(diaryItem);
        }
        return diary;
    }

    //==비즈니즈 로직==//

}
