package livingin.steptheater.controller;

import livingin.steptheater.domain.Member;
import livingin.steptheater.repository.diary.DiaryInfoDto;
import livingin.steptheater.repository.diary.DiaryQueryDto;
import livingin.steptheater.service.DiaryService;
import livingin.steptheater.service.MemberService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class DiaryController {
    private final MemberService memberService;
    private final DiaryService diaryService;

    /**
     * 전체 다이어리 조회 API
     * */
    @GetMapping("/api/diaries")
    public Result diaries() {
        List<DiaryQueryDto> diaryDtos = diaryService.findDiaryDtos();
        return new Result(diaryDtos.size(), diaryDtos);
    }

    /**
     * 특정 회원 다이어리 조회 API
     */
    @GetMapping("/api/diary")
    public Result findDiaries(
            @RequestParam(value = "id") Long userId,
            @RequestParam(value = "date") String date
    ) {

        List<DiaryQueryDto> diaryDto = diaryService.findOneDiaryDto(userId, date);
        return new Result(diaryDto.size(), diaryDto);
    }

    /**
     * 특정 회원의 일, 주, 월 다이어리 조회 API
     */
    @GetMapping("/api/diary/date")
    public DateResult findDiariesByDate(
            @RequestParam(value = "id") Long userId,
            @RequestParam(value = "date") String date,
            @RequestParam(value = "type") String type
    ) {
        String startDate = "";
        String endDate = "";
        String[] sDate = date.split("-");
        LocalDate localDate = LocalDate.of(Integer.parseInt(sDate[0]),
                Integer.parseInt(sDate[1]),
                Integer.parseInt(sDate[2]));
        System.out.println("localDate = " + localDate);
        if (type.equals("day")) {
            startDate = endDate = date;
        } else if (type.equals("week")) {
            LocalDate temp;
            if (localDate.getDayOfWeek().getValue() == 7)
                temp = localDate;
            else
                temp = localDate.minusDays(localDate.getDayOfWeek().getValue());
            startDate = temp.toString();
            endDate = temp.plusDays(6).toString();
            System.out.println("startDate = " + startDate);
            System.out.println("endDate = " + endDate);
        } else if (type.equals("month")) {
            LocalDate temp = localDate.minusDays(localDate.getDayOfMonth() - 1);
            startDate = temp.toString();
            endDate = temp.plusMonths(1).minusDays(1).toString();
        }
        return new DateResult(type, date, diaryService.findDiaryByDate(userId, startDate, endDate));
    }

    /**
     * 특정 회원의 최근 다이어리 조회 API
     */
    @GetMapping("/api/diary/recent")
    public RecentDateResult recentDiary(
            @RequestParam(value = "id") Long id,
            @RequestParam(value = "count") Integer count
    ) {
        List<DiaryInfoDto> recentDiary = diaryService.findRecentDiary(id, count);
        return new RecentDateResult(recentDiary.size(),recentDiary);
    }

    /**
     * 다이어리 생성 API
     */
    @PostMapping("/api/diary")
    public Long diaries(
            @RequestBody @Valid CreateDiaryRequest request
    ) {
        System.out.println(request);
        Member member = memberService.findOne(request.id);
        return diaryService.diary(member.getId(), LocalDate.parse(request.date));
    }

    /**
     * diary 생성 request class
     */
    @Data
    static class CreateDiaryRequest {
        private Long id;
        private String date;
    }

    /**
     * 결과 리턴 Data class
     */
    @Data
    @AllArgsConstructor
    static class Result<T> {
        private int count;
        private T Data;
    }

    /**
     * 결과 리턴 Data class
     */
    @Data
    @AllArgsConstructor
    static class DateResult<T> {
        private String type;
        private String dairyDate;
        private T Data;
    }

    /**
     * 결과 리턴 Data class
     */
    @Data
    @AllArgsConstructor
    static class RecentDateResult<T> {
        private int count;
        private T Data;
    }
}
