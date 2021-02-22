package livingin.steptheater.service;

import livingin.steptheater.domain.DiaryItem;
import livingin.steptheater.domain.Member;
import livingin.steptheater.domain.Route;
import livingin.steptheater.repository.DiaryRepository;
import livingin.steptheater.repository.MemberRepository;
import livingin.steptheater.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DiaryService {
    private final MemberRepository memberRepository;
    private final DiaryRepository diaryRepository;
    private final RouteRepository routeRepository;

    @Transactional
    public Long diary(Long memberId, Long RouteId, int count){

        //엔티티 조회
        Member member = memberRepository.findOne(memberId);
        Route route = routeRepository.findOne(RouteId);
        return 1L;
    }
}
