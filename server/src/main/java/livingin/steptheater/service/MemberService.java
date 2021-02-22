package livingin.steptheater.service;

import livingin.steptheater.domain.Member;
import livingin.steptheater.exception.memberException;
import livingin.steptheater.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    /**
     * 회원 가입
     */
    @Transactional
    public Long join(Member member) {
        Long result = validateDuplicateMember(member);
        if (result == 0L) { // 중복 회원 검증
            memberRepository.save(member);
            return member.getId();
        } else return result;
    }

    private Long validateDuplicateMember(Member member) {
        List<Member> findMembers = findMembersByEmail(member.getEmail());
        if (!findMembers.isEmpty()) {
            return findMembers.get(0).getId();
        }
        return 0L;
    }

    /**
     * 회원 전체 조회
     */

    public List<Member> findMembers() {
        return memberRepository.findAll();
    }

    public Member findOne(Long memberId) {
        return memberRepository.findOne(memberId);
    }

    public Member findOneByEmail(String email) {
        return memberRepository.findOneByEmail(email);
    }

    public Member findOneByNick(String nickname) {
        return memberRepository.findOneByNickName(nickname);
    }

    public Member findOneEmail(String nickname, String name) {
        return memberRepository.findOneEmail(nickname, name);
    }

    public List<Member> findMembersByEmail(String email) {
        return memberRepository.findByEmail(email);
    }


    @Transactional
    public void update(Long id, String email) {
        Member member = memberRepository.findOne(id);
        member.setEmail(email);
    }

    @Transactional
    public boolean updateCertified(String email, String certified) {
        Member member = memberRepository.findOneByEmail(email);
        if (member.getCertified().equals(certified))
            member.setEnabled(true);
        return member.isEnabled();
    }

    public String login(String email, String password) {
        Member findMember = memberRepository.findOneByEmail(email);
        if (findMember == null) {
            throw new memberException("존재하는 이메일이 없습니다.");
        }
        if (!findMember.getPassword().equals(password)) {
            throw new memberException("비밀번호가 일치하지 않습니다.");
        }
        if (!findMember.isEnabled()) {
            throw new memberException("이메일 인증을 먼저 진행해주세요!");
        }
        return "성공";
    }
}
