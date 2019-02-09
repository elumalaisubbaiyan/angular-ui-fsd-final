import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsApiService } from 'src/app/projects/services/projects-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Project } from 'src/app/projects/project';

@Component({
  selector: 'app-project-form-modal',
  templateUrl: './project-form-modal.component.html',
  styleUrls: ['./project-form-modal.component.css']
})
export class ProjectFormModalComponent implements OnInit {
  projectLookupForm: FormGroup;
  projectsList;
  selectedProject;
  loaded;

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private projectService: ProjectsApiService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.initializeForm();

    this.projectService.getAllProjects().subscribe(
      data => {
        this.projectsList = data;
        this.spinner.hide();
        this.loaded = true;
      },
      err => {
        console.error(`Error occured while getting projects data ${err}`);
        this.spinner.hide();
        this.loaded = true;
      }
    );
  }

  onchange(project: Project) {
    this.selectedProject = {
      'projectId': project.projectId,
      'projectName': project.projectName
    }
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

  private initializeForm() {
    this.projectLookupForm = this.formBuilder.group({
      projectId: '',
      projectName: ''
    });
  }
  private submitForm() {
    this.activeModal.close(this.selectedProject);
  }

}
