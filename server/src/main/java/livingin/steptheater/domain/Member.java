package livingin.steptheater.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class Member {

    @Id
    @GeneratedValue
    private Long id;

    @NotEmpty
    private String email;

    private String password;

    private String nickname;

    private String name;

    private LocalDateTime registerDate;

    private String oAuthUserId;

    private boolean privacy_Checked;

    private boolean location_Checked;

    private boolean isEnabled;

    private String certified;

    private String image_url;

    private String thumb_url;

    @OneToMany(mappedBy = "member")
    private List<Diary> diaries = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private MemberType memberType; // 회원 타입 [로컬, 애플, 구글, 페이스북]

}
