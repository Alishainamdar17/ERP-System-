package onedeoleela.onedeoleela.Entity.Planing_Entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dependency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long predecessorId;
    private Long successorId;

    private String type;   // SS, ES, EE, SE
    private Integer lagDays;
}
