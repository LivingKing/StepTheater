package livingin.steptheater.repository;

import livingin.steptheater.domain.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class MemberRepository {

    private final EntityManager em;

    public Long save(Member member) {
        em.persist(member);
        return member.getId();
    }

    public Member findOne(Long id) {
        return em.find(Member.class, id);
    }

    public Member findOneByEmail(String email) {
        List<Member> findMembers = em.createQuery(
                "select m from Member m " +
                        "where m.email = :email", Member.class)
                .setParameter("email", email)
                .setMaxResults(1)
                .getResultList();
        if(findMembers.isEmpty()) return null;
        return findMembers.get(0);
    }

    public Member findOneByNickName(String nickname) {
        List<Member> findMembers = em.createQuery(
                "select m from Member m " +
                        "where m.nickname = :nickname", Member.class)
                .setParameter("nickname", nickname)
                .setMaxResults(1)
                .getResultList();
        if(findMembers.isEmpty()) return null;
        return findMembers.get(0);
    }

    public Member findOneByOauthId(String oauthid) {
        List<Member> findMembers = em.createQuery(
                "select m from Member m " +
                        "where m.oAuthUserId = :oauthid", Member.class)
                .setParameter("oauthid", oauthid)
                .setMaxResults(1)
                .getResultList();
        if(findMembers.isEmpty()) return null;
        return findMembers.get(0);
    }

    public Member findOneEmail(String nickname, String name) {
        List<Member> findMembers = em.createQuery(
                "select m from Member m " +
                        "where m.nickname= :nickname " +
                        "and m.name= :name", Member.class)
                .setParameter("nickname", nickname)
                .setParameter("name", name)
                .setMaxResults(1)
                .getResultList();
        if(findMembers.isEmpty()) return null;
        return findMembers.get(0);
    }

    public Member findOnePassword(String email, String nickname, String name){
        List<Member> findMembers = em.createQuery(
                "select m from Member m " +
                        "where m.nickname= :nickname " +
                        "and m.name = :name " +
                        "and m.email= :email", Member.class)
                .setParameter("nickname", nickname)
                .setParameter("name", name)
                .setParameter("email", email)
                .setMaxResults(1)
                .getResultList();
        if(findMembers.isEmpty()) return null;
        return findMembers.get(0);
    }

    public List<Member> findAll() {
        return em.createQuery("select m from Member m", Member.class)
                .getResultList();
    }

    public List<Member> findByEmail(String email) {
        return em.createQuery(
                "select m from Member m " +
                        "where m.email = :email", Member.class)
                .setParameter("email", email)
                .getResultList();
    }
}
