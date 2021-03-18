package livingin.steptheater.repository.diary;

import livingin.steptheater.domain.DiaryItem;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
@Data
public class DiaryInfoDto {
    private Long id;
    private LocalDate DiaryDate;
    private List<RouteInfoDto> routes;

    public DiaryInfoDto(Long id, LocalDate diaryDate) {
        this.id = id;
        DiaryDate = diaryDate;
    }
}
