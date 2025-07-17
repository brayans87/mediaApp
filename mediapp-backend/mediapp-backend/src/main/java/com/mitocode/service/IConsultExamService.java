package com.mitocode.service;

import com.mitocode.model.ConsultExam;
import com.mitocode.model.Exam;

import java.util.List;

public interface IConsultExamService {

    List<Exam> getExamsByConsultId(Integer id);
}
