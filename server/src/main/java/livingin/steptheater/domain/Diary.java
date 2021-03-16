package livingin.steptheater.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
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
    private List<DiaryItem> diaryItem = new ArrayList<>();

    @Column(name ="diaryDate")
    private LocalDate diaryDate;

    //==연관관계 메서드==//
    public void setMember(Member member){
        this.member = member;
        member.getDiaries().add(this);
    }

//    public void addDiaryItem(DiaryItem diaryItem){
//        diaryItems.add(diaryItem);
//    }
//
//    public void addRoute(Route route){
//        routes.add(route);
//    }

    //==생성 메서드==//
    public static Diary createDiary(Member member, LocalDate date){
        Diary diary = new Diary();
        diary.setMember(member);
        diary.setDiaryDate(date);
        return diary;
    }

    //==비즈니즈 로직==//

}
