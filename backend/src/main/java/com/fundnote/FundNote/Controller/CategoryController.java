package com.fundnote.FundNote.Controller;

import com.fundnote.FundNote.Entity.CategoryEntity;
import com.fundnote.FundNote.Service.CategoryService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @PostMapping
    public String saveCategory(@RequestBody CategoryEntity category, HttpServletRequest request) throws ExecutionException, InterruptedException {
        return categoryService.saveCategory(category, request);
    }
}
