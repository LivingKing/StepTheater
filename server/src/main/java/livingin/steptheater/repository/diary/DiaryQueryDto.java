package livingin.steptheater.repository.diary;

import lombok.Data;

@Data
public class DiaryQueryDto {
    private Long diaryId;
    private String name;
    private String diaryDate;

    public DiaryQueryDto(Long diaryId, String name, String diaryDate) {
        this.diaryId = diaryId;
        this.name = name;
        this.diaryDate = diaryDate;
    }

}
