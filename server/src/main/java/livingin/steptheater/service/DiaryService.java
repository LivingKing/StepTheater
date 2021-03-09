package livingin.steptheater.service;

import livingin.steptheater.domain.Diary;
import livingin.steptheater.domain.Member;
import livingin.steptheater.repository.DiaryRepository;
import livingin.steptheater.repository.MemberRepository;
import livingin.steptheater.repository.diary.DiaryInfoDto;
import livingin.steptheater.repository.diary.DiaryQueryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DiaryService {
    private final MemberRepository memberRepository;
    private final DiaryRepository diaryRepository;

    @Transactional
    public Long diary(Long memberId, String date) {

        //엔티티 조회
        Member member = memberRepository.findOne(memberId);
        Diary diary = Diary.createDiary(member, date);

        diaryRepository.save(diary);
        return diary.getId();
    }

    public Diary findOne(Long id) {
        return diaryRepository.findOne(id);
    }

    public List<DiaryQueryDto> findDiaryDtos() {
        return diaryRepository.findDiaryDtos();
    }

    public List<DiaryQueryDto> findOneDiaryDto(Long userId, String date) {
        return diaryRepository.findOneDiaryDto(userId, date);

    }

    public Diary findOneDiary(Long userId, String date) {
        return diaryRepository.findOneDiary(userId, date);
    }

    public List<DiaryInfoDto> findDiaryByDate(Long userId, String date, String type) {
        return diaryRepository.findDiaryByDate(userId, date);
    }

}
