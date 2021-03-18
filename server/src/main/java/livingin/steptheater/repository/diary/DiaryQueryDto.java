package livingin.steptheater.repository.diary;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DiaryQueryDto {
    private Long diaryId;
    private String name;
    private LocalDate diaryDate;

    public DiaryQueryDto(Long diaryId, String name, LocalDate diaryDate) {
        this.diaryId = diaryId;
        this.name = name;
        this.diaryDate = diaryDate;
    }

}
