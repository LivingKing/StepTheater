package livingin.steptheater.controller;

import livingin.steptheater.domain.DiaryItem;
import livingin.steptheater.domain.Member;
import livingin.steptheater.domain.Route;
import livingin.steptheater.repository.DiaryItemRepository;
import livingin.steptheater.repository.RouteRepository;
import livingin.steptheater.repository.diary.DiaryInfoDto;
import livingin.steptheater.repository.diary.DiaryQueryDto;
import livingin.steptheater.service.DiaryItemService;
import livingin.steptheater.service.DiaryService;
import livingin.steptheater.service.MemberService;
import livingin.steptheater.service.RouteService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.jni.Local;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class DiaryController {
    private final MemberService memberService;
    private final DiaryService diaryService;
    private final RouteService routeService;
    private final DiaryItemService diaryItemService;

    @GetMapping("/api/diaries")
    public Result diaries() {
        List<DiaryQueryDto> diaryDtos = diaryService.findDiaryDtos();
        return new Result(diaryDtos.size(), diaryDtos);
    }

    @GetMapping("/api/diary")
    public Result findDiaries(
            @RequestParam(value = "id") Long userId,
            @RequestParam(value = "date") String date
    ) {
        List<DiaryQueryDto> diaryDto = diaryService.findOneDiaryDto(userId, date);
        return new Result(diaryDto.size(), diaryDto);
    }

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
            if(localDate.getDayOfWeek().getValue() == 7)
                temp = localDate;
            else
                temp = localDate.minusDays(localDate.getDayOfWeek().getValue());
            startDate = temp.toString();
            endDate = temp.plusDays(6).toString();
            System.out.println("startDate = " + startDate);
            System.out.println("endDate = " + endDate);
        } else if (type.equals("month")) {
            LocalDate temp = localDate.minusDays(localDate.getDayOfMonth()-1);
            startDate = temp.toString();
            endDate = temp.plusMonths(1).minusDays(1).toString();
        }
        return new DateResult(type, date, diaryService.findDiaryByDate(userId, startDate, endDate));
    }

    @PostMapping("/api/diary")
    public Long diaries(
            @RequestBody @Valid CreateDiaryRequest request
    ) {
        System.out.println(request);
        Member member = memberService.findOne(request.id);
        return diaryService.diary(member.getId(), LocalDate.parse(request.date));
    }

    @Data
    static class CreateDiaryRequest {
        private Long id;
        private String date;
    }

    @Data
    @AllArgsConstructor
    static class Result<T> {
        private int count;
        private T Data;
    }

    @Data
    @AllArgsConstructor
    static class DateResult<T> {
        private String type;
        private String dairyDate;
        private T Data;
    }
}
