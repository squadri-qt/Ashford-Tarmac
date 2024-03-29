<?php

function handle_post() {
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 0');
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Cache-Control, x-at-type");
        exit(0);
    }

    $form_name = $_SERVER['HTTP_X_AT_TYPE'] ?? 'none';
    $data = [];
    $files = [];
    $success_msg = 'OK';
    if (!empty($_SERVER['CONTENT_LENGTH']) && empty($_FILES) && empty($_POST)) {
        return ['success' => false, 'message' => 'Submission could not be processed'];
    }

    switch ($form_name) {
        case 'estimate':
            $success_msg = 'We will be in touch shortly.';
            $data['Client Type'] = preg_replace('/[^\w\s@]+/', '', $_POST['client'] ?? '');
            $data['Name'] = preg_replace('/[^\w\s@]+/', '', $_POST['name'] ?? '');
            $data['Tel'] = preg_replace('/[^\d+]+/', '', $_POST['tel'] ?? '');
            $data['Email'] = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL, ['flags' => FILTER_NULL_ON_FAILURE]);
            $data['Notes'] = preg_replace('/[^\d\w\s\/\\_=!"£$%&@,.*{}()\r\n+-]+/', "", $_POST['notes']);
            foreach ($_FILES as $k => $file) {
                $filename = basename($file['name'] ?? '');
                $filesize = intval($file['size'] ?? '0');
                $filetype = preg_replace('/[^\w\/-]+/', '', $file['type'] ?? 'application/octet-stream');
                $filetmp = $file['tmp_name'];
                if (empty($filename) || empty($filetype)) {
                    return ['success' => false, 'message' => "One of selected files is unsupported", 'file' => $file, 'res' => [$filename, $filesize, $filetype]];
                }
                array_push($files, ['name' => $filename, 'type' => $filetype, 'tmpfile' => $filetmp]);
            }
            break;
        case 'contact':
            $data['Name'] = preg_replace('/[^\w\s@]+/', '', $_POST['name'] ?? '');
            $data['Phone'] = preg_replace('/[^\d+]+/', '', $_POST['phone'] ?? '');
            $data['Email'] = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL, ['flags' => FILTER_NULL_ON_FAILURE]);
            break;
        case 'call-back':
            $meridem = (preg_match('/^(AM|PM)$/', $_POST['meridiem'], $m, PREG_UNMATCHED_AS_NULL) == 1) ? $m[1] : null;
            $date['Time'] = (preg_match('/^(\d{1,2}:\d\d)$/', $_POST['time'] ?? '', $m, PREG_UNMATCHED_AS_NULL) == 1) ? $m[1] : null;
            $date['Date'] = (preg_match('/^(\d{4}-\d{2}-\d{2})$/', $_POST['date'] ?? '', $m, PREG_UNMATCHED_AS_NULL) == 1) ? $m[1] : null;
            $date['Phone'] = preg_replace('/[^\d+]+/', '', $_POST['phone'] ?? '');
            break;
        default:
            http_response_code(403);
            exit(0);
    }

    foreach ($data as $k => $v) {
        if (empty($v)) {
            return ['success' => false, 'message' => "$k is invalid. Please correct the issue and try again.", 'post' => $_POST, 'data' => $data];
        }
    }
    return ['success' => true, 'data' => (object)$data, 'files' => (object)$files, 'message' => $success_msg];
}

header('Content-Type: application/json;charset=utf8');
header('Cache-Control: no-cache');
echo json_encode((object)handle_post());
