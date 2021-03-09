package livingin.steptheater.repository.diary;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RouteInfoDto {
    private String name;
    private RouteItemInfoDto routeItemInfoDto;
}
