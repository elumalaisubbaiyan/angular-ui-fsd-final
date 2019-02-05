import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProjectsApiService } from './services/projects-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import { Project } from './project';
import { Options } from 'ng5-slider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFormModalComponent } from '../modal/user-form-modal/user-form-modal.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projectForm;
  loaded;
  serviceResponse;
  serviceError;
  projectsList;
  editMode: boolean;
  viewMode: boolean;
  public searchText: string;
  sortBy: string;
  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 30
  };


  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private projectService: ProjectsApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal) { }

  openFormModal() {
    const modalRef = this.modalService.open(UserFormModalComponent);

    modalRef.result.then((result) => {
      if (result && result.userId) {
        this.projectForm.controls['managerId'].setValue(result.userId);
        this.projectForm.controls['managerName'].setValue(result.userName);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.sortBy = 'firstName';
    this.initializeForm();
    const projectId = + this.route.snapshot.paramMap.get('projectId');
    this.populateProjects();
  }

  clearFields() {
    this.editMode = false;
    this.initializeForm();
  }

  toDateInputValue(date: Date) {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toJSON().slice(0, 10);
  };

  toggleDates(e) {
    if (e.target.checked) {
      this.cd.detectChanges();
      this.projectForm.controls['startDate'].enable();
      this.projectForm.controls['startDate'].setValue(this.toDateInputValue(new Date()));
      this.projectForm.controls['endDate'].enable();
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.projectForm.controls['endDate'].setValue(this.toDateInputValue(tomorrow));
      this.cd.detectChanges();
    } else {
      this.projectForm.controls['startDate'].disable();
      this.projectForm.controls['startDate'].setValue('');
      this.projectForm.controls['endDate'].disable();
      this.projectForm.controls['endDate'].setValue('');
    }
  }

  initializeForm() {
    this.projectForm = this.fb.group({
      projectId: [],
      projectName: ['', Validators.required],
      priority: [5,],
      startDate: [{ value: '', disabled: true }, [Validators.required]],
      endDate: [{ value: '', disabled: true }, [Validators.required]],
      managerId: [''],
      managerName: [''],
      setDates: false
    });
    this.cd.detectChanges();
    this.projectForm.controls['startDate'].disable();
    this.projectForm.controls['endDate'].disable();
    this.serviceResponse = '';
    this.serviceError = '';
  }

  populateProjectForm(data) {
    this.editMode = true;
    window.scroll(0, 0);
    let setDates = false;
    if (data.startDate && data.endDate) {
      this.projectForm.controls['startDate'].enable();
      this.projectForm.controls['endDate'].enable();
      setDates = true;
      this.cd.detectChanges();
    }
    this.projectForm = this.fb.group({
      projectId: [data.projectId],
      projectName: [data.projectName, [Validators.required]],
      priority: [data.priority],
      setDates: setDates,
      startDate: [setDates && data.startDate, [Validators.required]],
      endDate: [setDates && data.endDate, [Validators.required]],
      managerId: [data.managerId],
      managerName: [data.manager && data.manager.firstName]
    });
  }

  populateProjects() {
    this.projectService.getAllProjects().subscribe(
      data => {
        this.projectsList = data;
        this.spinner.hide();
        this.loaded = true;
      },
      err => {
        console.error(`Error occured while getting projects data ${err}`);
        this.projectsList = [
          { "projectId": 1, "projectName": "Test Project", "startDate": "2019-01-01", "endDate": "2019-02-01" },
          { "projectId": 2, "projectName": "Test Project 2", "startDate": "2019-01-01", "endDate": "2019-02-01" }];
        this.spinner.hide();
        this.loaded = true;
      }
    );
  }

  onEdit(project: Project) {
    this.populateProjectForm(project);
  }

  onDelete(project: Project) {
    this.spinner.show();
    this.projectService.deleteProject(project.projectId).subscribe(
      (data) => {
        this.serviceError = '';
        window.location.reload();
        this.spinner.hide();
      },
      err => {
        console.error("Error occured when Deleting project " + JSON.stringify(err));
        this.serviceError = 'Delete Project Failed. Please try again';
        this.spinner.hide();
      });
  }


  onSubmit() {
    this.spinner.show();
    if (this.projectForm.valid) {
      this.serviceResponse = '';
      let projectObj = this.getSubmittedFormData();
      if (this.editMode) {
        this.projectService.updateProject(projectObj.projectId, projectObj).subscribe(
          (data) => {
            window.location.reload();
            this.spinner.hide();
          },
          err => {
            console.error("Error occured when Updating project " + err);
            this.serviceError = 'Update Project Failed. Please try again';
            this.spinner.hide();
          });
      }
      else {
        this.projectService.addProject(projectObj).subscribe(
          (data) => {
            //this.prettyPrint(JSON.stringify(data));
            window.location.reload();
          },
          err => {
            console.error("Error occured when adding project " + err);
            this.serviceError = 'Add Project Failed. Please try again';
            this.spinner.hide();
          });
      }
    } else {
      const invalid = [];
      const controls = this.projectForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name + '\n');
        }
      }
      this.spinner.hide();
      alert("Form values are invalid. Please verify the below field values " + '\n' + invalid);
      return invalid;
    }
  }

  getSubmittedFormData(): Project {
    let projectFormData = this.projectForm.value;
    let projectObj = new Project();
    if (this.editMode) {
      projectObj.projectId = projectFormData.projectId;
    }
    projectObj.projectName = projectFormData.projectName;
    //Set the date based on the checkbox selected
    if (projectFormData.startDate && projectFormData.endDate) {
      projectObj.startDate = projectFormData.startDate;
      projectObj.endDate = projectFormData.endDate;
    }
    if (projectFormData.priority && projectFormData.priority > 0) {
      projectObj.priority = projectFormData.priority;
    }
    if (projectFormData.managerId && projectFormData.managerId != 0) {
      projectObj.managerId = projectFormData.managerId;
    }
    console.log("projectObj " + JSON.stringify(projectObj));
    return projectObj;
  }

}
