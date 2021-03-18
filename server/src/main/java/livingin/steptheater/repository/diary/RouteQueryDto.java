package livingin.steptheater.repository.diary;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RouteQueryDto {
    private Long id;
    private String name;
    private Double distance;
    private Integer hours;
    private Integer minutes;
    private Integer markers;
}
