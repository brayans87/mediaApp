package com.mitocode.repo;

import com.mitocode.model.Exam;
import com.mitocode.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IExamRepo extends IGenericRepo<Exam, Integer> {

}
