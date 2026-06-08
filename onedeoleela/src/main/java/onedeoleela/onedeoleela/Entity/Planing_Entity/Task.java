package onedeoleela.onedeoleela.Entity.Planing_Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🌳 WBS
    private String wbsId;
    private Long parentId;

    // 🔥 PROJECT LINK
    private Long projectId;

    // 🧩 BASIC
    private String name;
    private String unitName;

    // 🏗 ERP
    private String department;

    @Column(name = "quantity_sqft")
    private Double quantitySqft;

    // 📅 DATES
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer duration;

    // 📊 PROGRESS
    private Integer progressPercent = 0;

    // ⚠️ DELAY
    private LocalDate revisedEndDate;
    private String delayReason;

    // 🏢 EXTRA ERP FIELDS
    @Column(name = "wo_number")
    private String woNumber;

    @Column(name = "project_code")
    private String projectCode;

    @Column(name = "action_person")
    private String actionPerson;

    @Column(name = "remark", length = 1000)
    private String remark;

    // 📌 STATUS
    private String status = "NOT_STARTED";
}