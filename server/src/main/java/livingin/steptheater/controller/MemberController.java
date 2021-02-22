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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @GetMapping("/api/members")
    public GetMembersResponse member() {
        List<Member> findMembers = memberService.findMembers();
        List<MemberDto> collect = findMembers.stream()
                .map(m -> new MemberDto(m.getId(), m.getEmail()))
                .collect(Collectors.toList());

        return new GetMembersResponse(collect.size(), collect);
    }

    @GetMapping("/api/member")
    public GetMemberResponse findMember(
            @RequestParam(value = "id", defaultValue = "0") Long id,
            @RequestParam(value = "email", defaultValue = "") String email,
            @RequestParam(value = "nickname", defaultValue = "") String nickname
    ) {
        if (id > 0L) {
            Member findMember = memberService.findOne(id);
            return new GetMemberResponse(findMember.getId(), findMember.getEmail());
        } else if (!email.equals("")) {
            Member findMember = memberService.findOneByEmail(email);
            if (findMember == null) {
                return new GetMemberResponse(0L, "none");
            }
            return new GetMemberResponse(findMember.getId(), findMember.getEmail());
        } else if (!nickname.equals((""))) {
            String decodedNickname = URLDecoder.decode(nickname, StandardCharsets.UTF_8);
            Member findMember = memberService.findOneByNick(decodedNickname);
            if (findMember == null) {
                return new GetMemberResponse(0L, "none");
            }
            return new GetMemberResponse(findMember.getId(), findMember.getEmail());
        } else
            return new GetMemberResponse(0L, "none");
    }

    @RequestMapping("/api/member/certified")
    public void certifiedEmail(
            @RequestParam(value = "email") String email,
            @RequestParam(value = "certified") String certified,
            HttpServletResponse response
    )throws IOException {
        boolean result = memberService.updateCertified(email, certified);
        if(result){
            response.sendRedirect("/email/successCertified.html");
        }else {
            response.sendRedirect("/email/failCertified.html");
        }
    }
    @GetMapping("/api/member/findEmail")
    public GetFindEmailResponse findEmail(
            @RequestParam(value = "nickname") String nickname,
            @RequestParam(value = "name") String name
    ) {
        Member findMember = memberService.findOneEmail(nickname, name);
        if (findMember == null) throw new memberException("회원 정보가 존재하지 않습니다.");
        return new GetFindEmailResponse(findMember.getEmail());
    }


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


    @PutMapping("/api/members/{id}")
    public UpdateMemberResponse updateMember(
            @PathVariable("id") Long id,
            @RequestBody @Valid UpdateMemberRequest request) {
        memberService.update(id, request.getEmail());
        Member findMember = memberService.findOne(id);
        return new UpdateMemberResponse(findMember.getId(), findMember.getNickname());
    }

    @PostMapping("/api/member/login")
    public LoginMemberResponse loginMember(
            @RequestBody @Valid LoginMemberRequest request) {
        String message = memberService.login(request.email, request.password);
        Member member = memberService.findOneByEmail(request.email);
        return new LoginMemberResponse(message, member.getId(), member.getEmail(), member.getMemberType(), member.getNickname());
    }

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
    }

    @Data
    @AllArgsConstructor
    static class UpdateMemberResponse {
        private Long id;
        private String Email;
    }

    @Data
    static class UpdateMemberRequest {
        private String Email;
    }

    @Data
    @AllArgsConstructor
    static class LoginMemberResponse {
        private String message;
        private Long id;
        private String email;
        private MemberType memberType;
        private String nickname;
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
}
