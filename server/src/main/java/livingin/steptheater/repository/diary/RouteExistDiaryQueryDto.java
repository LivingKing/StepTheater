package livingin.steptheater.repository.diary;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class RouteExistDiaryQueryDto {
    private LocalDate diaryDate;
}
