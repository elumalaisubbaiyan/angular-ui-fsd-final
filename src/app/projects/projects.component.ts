import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProjectsApiService } from './services/projects-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import { Project } from './project';
import { Options } from 'ng5-slider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFormModalComponent } from '../modal/user-form-modal/user-form-modal.component';
import { DateValidator } from '../validators/DateValidator';

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
  loadError;
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
    modalRef.componentInstance.modalType = 'users';

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

  toggleDates(e) {
    if (e.target.checked) {
      this.cd.detectChanges();
      this.projectForm.controls['startDate'].enable();
      this.projectForm.controls['startDate'].setValue(DateValidator.toDateInputValue(new Date()));
      this.projectForm.controls['endDate'].enable();
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.projectForm.controls['endDate'].setValue(DateValidator.toDateInputValue(tomorrow));
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
      priority: [0,],
      startDate: [{ value: '', disabled: true }, [Validators.required]],
      endDate: [{ value: '', disabled: true }, [Validators.required]],
      managerId: [''],
      managerName: [''],
      setDates: false
    }, {
        validator: Validators.compose([
          DateValidator.dateLessThan('endDate', 'startDate', { 'enddate': true })])
      }
    );
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
      managerName: [data.manager && (data.manager.firstName + " " + data.manager.lastName)]
    }, {
        validator: Validators.compose([
          DateValidator.dateLessThan('endDate', 'startDate', { 'enddate': true })])
      }
    );
  }

  populateProjects() {
    this.projectService.getAllProjects().subscribe(
      data => {
        this.projectsList = data;
        this.spinner.hide();
        this.loaded = true;
        this.loadError = '';
      },
      err => {
        console.error(`Error occured while getting projects data ${err}`);
        if (err.status != 404) {
          this.loadError = 'Error occured while getting projects data';
        }
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

    if (this.projectForm.valid && !this.projectForm.hasError('enddate')) {
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
      this.spinner.hide();
      if (this.projectForm.hasError('enddate')) {
        alert("End date cannot be less than start date" + '\n');
        return;
      }
      const invalid = [];
      const controls = this.projectForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name + '\n');
        }
      }
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
