package livingin.steptheater.controller;

import livingin.steptheater.domain.Member;
import livingin.steptheater.domain.MemberType;
import livingin.steptheater.exception.memberException;
import livingin.steptheater.service.MemberService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    /**
     * 전체 멤버 조회 API
     */
    @GetMapping("/api/members")
    public GetMembersResponse member() {
        List<Member> findMembers = memberService.findMembers();
        List<MemberDto> collect = findMembers.stream()
                .map(m -> new MemberDto(m.getId(), m.getEmail()))
                .collect(Collectors.toList());

        return new GetMembersResponse(collect.size(), collect);
    }

    /**
     * 특정 멤버 조회 API
     */
    @GetMapping("/api/member")
    public GetMemberResponse findMember(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "nickname", required = false) String nickname,
            @RequestParam(value = "oauth", required = false) String oauth
    ) {
        Member findMember = null;
        if (id != null)
            findMember = memberService.findOne(id);
        else if (email != null)
            findMember = memberService.findOneByEmail(email);
        else if (nickname != null) {
            String decodedNickname = URLDecoder.decode(nickname, StandardCharsets.UTF_8);
            findMember = memberService.findOneByNick(decodedNickname);
        } else if (oauth != null)
            findMember = memberService.findOneByOAuth(oauth);

        if (findMember == null) {
            return new GetMemberResponse(0L, "none", "none","none", null);
        }
        return new GetMemberResponse(findMember.getId(), findMember.getEmail(), findMember.getNickname(),findMember.getName(), findMember.getRegisterDate().toLocalDate());
    }

    /**
     * 멤버 인증 확인 API
     */
    @RequestMapping("/api/member/certified")
    public void certifiedEmail(
            @RequestParam(value = "email") String email,
            @RequestParam(value = "certified") String certified,
            HttpServletResponse response
    ) throws IOException {
        boolean result = memberService.updateCertified(email, certified);
        if (result) {
            response.sendRedirect("/email/successCertified.html");
        } else {
            response.sendRedirect("/email/failCertified.html");
        }
    }

    /**
     *  ID/PW 찾기 페이지 API
     */
    @RequestMapping("/api/member/findPW")
    public void findPwEmail(
            @RequestParam(value = "email") String email,
            @RequestParam(value = "certified") String certified,
            HttpServletResponse response
    ) throws IOException {
        Member findMember = memberService.findOneByEmail(email);
        if (findMember.getCertified().equals(certified))
            response.sendRedirect("/email/findPW.html");
    }

    /**
     * email 찾기 API
     */
    @GetMapping("/api/member/findEmail")
    public GetFindEmailResponse findEmail(
            @RequestParam(value = "nickname") String nickname,
            @RequestParam(value = "name") String name
    ) {
        Member findMember = memberService.findOneEmail(nickname, name);
        if (findMember == null) throw new memberException("회원 정보가 존재하지 않습니다.");
        return new GetFindEmailResponse(findMember.getEmail());
    }

    /**
     * PW 찾기 API
     */
    @GetMapping("/api/member/findPw")
    public GetFindPWResponse findPassword(
            @RequestParam(value = "email") String email,
            @RequestParam(value = "nickname") String nickname,
            @RequestParam(value = "name") String name
    ) {
        Member findMember = memberService.findOnePassword(email, nickname, name);
        if (findMember == null) throw new memberException("회원 정보가 존재하지 않습니다.");
        return new GetFindPWResponse(findMember.getEmail(), findMember.getNickname(), findMember.getCertified());
    }


    /**
     * 멤버 저장 API
     */
    @PostMapping("/api/members")
    public CreateMemberResponse saveMember(@RequestBody @Valid CreateMemberRequest request) {
        System.out.println("request = " + request);
        Member member = new Member();
        member.setEmail(request.email);
        member.setPassword(request.password);
        member.setNickname(request.nickname);
        member.setName(request.name);
        member.setLocation_Checked(request.location);
        member.setPrivacy_Checked(request.privacy);
        member.setRegisterDate(LocalDateTime.now());
        if (request.type.equals("Apple")) {
            member.setMemberType(MemberType.Apple);
            member.setOAuthUserId(request.oauthuserid);
            member.setEnabled(true);
        } else if (request.type.equals(("Local"))) {
            member.setCertified(certified_key());
            member.setMemberType(MemberType.Local);
            member.setEnabled(false);
        }
        Long id = memberService.join(member);
        return new CreateMemberResponse(id, member.getEmail(), member.getNickname(), member.getCertified());
    }

    /**
     * 특정 회원 업데이트 API
     */
    @PutMapping("/api/member/{id}")
    public UpdateMemberResponse updateMember(
            @PathVariable("id") Long id,
            @RequestBody @Valid UpdateMemberRequest request) {
        memberService.update(id, request.nickname, request.privacy, request.location,request.image_url, request.thumb_url);
        Member findMember = memberService.findOne(id);
        return new UpdateMemberResponse(findMember.getId(), findMember.getNickname(), findMember.isPrivacy_Checked(), findMember.isLocation_Checked(), findMember.getImage_url(), findMember.getThumb_url());
    }

    /**
     * 특정 회원 Oauth 정보 업데이트 API
     */
    @PutMapping("/api/member/{id}/OAuth")
    public UpdateOAuthMemberResponse updateOAuthMember(
            @PathVariable("id") Long id,
            @RequestBody @Valid UpdateOAuthMemberRequest request) {
        memberService.updateOAuth(id, request.nickname, request.privacy, request.location);
        Member findMember = memberService.findOne(id);
        return new UpdateOAuthMemberResponse(findMember.getId(), findMember.getNickname());
    }

    /**
     * 로그인 API
     */
    @PostMapping("/api/member/login")
    public LoginMemberResponse loginMember(
            @RequestBody @Valid LoginMemberRequest request) {
        String message = memberService.login(request.email, request.password);
        Member member = memberService.findOneByEmail(request.email);
        return new LoginMemberResponse(message, member.getId(), member.getEmail(), member.getMemberType(), member.getNickname(), member.getName(), member.getImage_url(), member.getThumb_url(), member.isPrivacy_Checked(), member.isLocation_Checked());
    }

    /**
     * 인증 키 생성 함수
     */
    private String certified_key() {
        Random random = new Random();
        StringBuffer sb = new StringBuffer();
        int num = 0;
        while (sb.length() < 10) {
            num = random.nextInt(75) + 48;
            if (Character.isAlphabetic(num) || Character.isDigit(num)) {
                sb.append((char) num);
            }
        }
        return sb.toString();
    }

    /**
     * Data 처리를 위한 Data class들
     */
    @Data
    @AllArgsConstructor
    static class GetMembersResponse<T> {
        private int count;
        private T data;
    }

    @Data
    @AllArgsConstructor
    static class MemberDto {
        private Long id;
        private String email;
    }

    @Data
    @AllArgsConstructor
    static class CreateMemberResponse {
        private Long id;
        private String email;
        private String nickname;
        private String certified;
    }

    @Data
    static class CreateMemberRequest {
        private String email;
        private String password;
        private String nickname;
        private String name;
        private String oauthuserid;
        private boolean privacy;
        private boolean location;
        @NotEmpty
        private String type;

    }

    @Data
    @AllArgsConstructor
    static class GetMemberResponse {
        private Long id;
        private String email;
        private String nickname;
        private String name;
        private LocalDate registerDate;
    }

    @Data
    @AllArgsConstructor
    static class UpdateMemberResponse {
        private Long id;
        private String nickname;
        private boolean privacy;
        private boolean location;
        private String image_url;
        private String thumb_url;
    }

    @Data
    static class UpdateMemberRequest {
        private String nickname;
        private boolean privacy;
        private boolean location;
        private String image_url;
        private String thumb_url;
    }

    @Data
    @AllArgsConstructor
    static class LoginMemberResponse {
        private String message;
        private Long id;
        private String email;
        private MemberType memberType;
        private String nickname;
        private String name;
        private String image_url;
        private String thumb_url;
        private Boolean privacy;
        private Boolean location;
    }

    @Data
    static class LoginMemberRequest {
        private String email;
        private String password;
    }

    @Data
    @AllArgsConstructor
    static class GetFindEmailResponse {
        private String email;
    }

    @Data
    @AllArgsConstructor
    static class GetFindPWResponse {
        private String email;
        private String nickname;
        private String certified;
    }

    @Data
    static class UpdateOAuthMemberRequest {
        private String nickname;
        private boolean privacy;
        private boolean location;
    }

    @Data
    @AllArgsConstructor
    static class UpdateOAuthMemberResponse {
        private Long id;
        private String nickname;
    }
}
