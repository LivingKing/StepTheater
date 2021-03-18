package livingin.steptheater.repository.diary;

import lombok.Data;

<<<<<<< HEAD
import java.time.LocalDate;

=======
>>>>>>> feature/detail
@Data
public class DiaryQueryDto {
    private Long diaryId;
    private String name;
<<<<<<< HEAD
    private LocalDate diaryDate;

    public DiaryQueryDto(Long diaryId, String name, LocalDate diaryDate) {
=======
    private String diaryDate;

    public DiaryQueryDto(Long diaryId, String name, String diaryDate) {
>>>>>>> feature/detail
        this.diaryId = diaryId;
        this.name = name;
        this.diaryDate = diaryDate;
    }

}
