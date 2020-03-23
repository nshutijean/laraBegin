<template>
    <div class="container">
        <div class="row mt-5" v-if="$gate.isAdminOrAuthor()">
          <div class="col-md-12" >
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Customers</h3>

                <!-- Old modal creation -->
                <!-- <div class="card-tools">
                    <button type="submit" class="btn btn-success" data-toggle="modal" data-target="#addNew">
                        <i class="fas fa-user-plus"></i>
                        Add New
                    </button>
                </div> -->
                <!-- New reusable modal -->
                <div class="card-tools">
                    <button type="submit" class="btn btn-success" @click="newModal">
                        <i class="fas fa-user-plus"></i>
                        Add New
                    </button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Registered Date</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                      <!-- Users table -->
                      <!-- using a pipe to append filter to text -->
                    <tr v-for="user in users.data" :key="user.id">
                      <td>{{user.id}}</td>
                      <td>{{user.name | capitalize}}</td>
                      <td>{{user.email}}</td>
                      <td>{{user.type | upText}}</td>
                      <td>{{user.created_at | dateFormat}}</td>
                      <td>
                          <!-- Edit button(icon) -->
                          <a href="#" @click="editModal(user)">
                              <i class="fa fa-user-edit blue"></i>
                          </a>&#9679;
                          <!-- Delete button -->
                          <a href="#" @click="deleteUser(user.id)">
                              <i class="fa fa-trash red"></i>
                          </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                  <pagination :data="users" @pagination-change-page="getResults"></pagination>
              </div>
            </div>
            <!-- /.card -->
          </div>
        </div>
        <div v-if="!$gate.isAdminOrAuthor()">
            <not-found></not-found>
        </div>

        <!-- A pop-up modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add New</h5>
                    <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update User's info</h5>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                 <!--User Form via a modal -->
                <form @submit.prevent="editMode ? updateUser() : createUser()" method="post">
                <div class="modal-body">
                    <!-- Name -->
                    <div class="form-group">
                        <input v-model="form.name" type="text" name="name"
                        placeholder="Name"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                        <has-error :form="form" field="name"></has-error>
                    </div>
                    <!-- EMail -->
                    <div class="form-group">
                        <input v-model="form.email" type="email" name="email"
                        placeholder="Email Address..."
                        class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                        <has-error :form="form" field="email"></has-error>
                    </div>
                    <!-- Bio -->
                    <div class="form-group">
                        <textarea v-model="form.bio" name="bio"
                        placeholder="Words(<200)"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                        <has-error :form="form" field="bio"></has-error>
                    </div>
                    <!--User type -->
                    <div class="form-group">
                        <select v-model="form.type" name="type"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                            <option value="">Choose User</option>
                            <option value="admin">Admin</option>
                            <option value="user">Standard User</option>
                            <option value="author">Author</option>
                        </select>
                        <has-error :form="form" field="type"></has-error>
                    </div>
                    <!-- Password -->
                    <div class="form-group">
                        <input v-model="form.password" type="password" name="password" id="password"
                        placeholder="Password"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                        <has-error :form="form" field="password"></has-error>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button v-show="!editMode" id="create" type="submit" class="btn btn-primary" >Create</button>
                    <button v-show="editMode" id="create" type="submit" class="btn btn-success" >Update</button>

                </div>
                </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                editMode: false,
                users: {},
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: '',

                })
            }
        },
        methods: {
            newModal() {
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },
            editModal(user) {
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);
            },
            updateUser() {
                this.form.put('api/user/'+this.form.id)
                .then(() => {
                    this.$Progress.start();
                    Fire.$emit('afterAction');
                    Toast.fire({
                        icon: 'success',
                        title: 'User updated successfully'
                    })
                    $('#addNew').modal('hide');
                    this.$Progress.finish();
                })
                .catch(() => {
                    Toast.fire({
                        icon: 'error',
                        title: 'User cannot be updated'
                    })
                    this.$Progress.fail();
                })
            },
            createUser() {
                console.log("Creating...");
                
                this.$Progress.start();
                this.form.post('api/user')
                .then(() => {
                    this.$Progress.start();
                    //custom event
                    Fire.$emit('afterAction');
                    //hiding modal after user creation
                    $('#addNew').modal('hide');
                    //sweetAlert toast
                    Toast.fire({
                        icon: 'success',
                        title: 'User created successfully'
                    })
                    this.$Progress.finish()

                })
                .catch(() => {
                    Toast.fire({
                        icon: 'error',
                        title: 'Oops something went wrong😢'
                    })
                    this.$Progress.fail();
                })
            },
            deleteUser(id) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                            if(result.value) {
                            //Send ajax request(to the server) of delete here
                            this.form.delete('api/user/'+id).then(() => {
                                this.$Progress.start();
                                Swal.fire(
                                'Deleted!',
                                'User has been deleted.',
                                'success'
                                )
                                Fire.$emit('afterAction');
                                this.$Progress.finish();
                            }).catch(() => {
                                this.$Progress.fail();
                                Swal.fire(
                                'Deletion failed!',
                                'User can not be deleted.',
                                'error'
                                )
                            })
                        }
                })
                
            },

            loadUsers() {
                //sends an http request on if it's an admin(authorized)
                if(this.$gate.isAdminOrAuthor()) {
                    axios.get('api/user',
                        //this returns an array
                    // ).then(({data}) => (this.users = data.data));
                        //this returns an object
                    ).then(({data}) => (this.users = data));
                    
                }
            },
            getResults(page = 1) {
                axios.get('api/user?page=' + page)
				.then(response => {
					this.users = response.data;
				});
            }
        },
        //launched when the app is up
        created() {
            Fire.$on('searching', () => {
                let query = this.$parent.search;
                axios.get('api/findUser?q=' + query)
                .then((res) => {
                    this.users = res.data;
                }).catch(() => {
                    
                });
            });
            this.loadUsers();
            //load users each 3 seconds
            // setInterval(() => {this.loadUsers()}, 3000);

            //listening to custom even
            Fire.$on('afterAction', () => { this.loadUsers() });
        }
    }
</script>
